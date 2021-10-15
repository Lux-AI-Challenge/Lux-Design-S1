import atexit
import os
import sys

from queue import Empty, Queue
from subprocess import PIPE, Popen
from threading import Thread
from typing import IO, Dict


Configuration = Dict[str, any]


class Observation(Dict[str, any]):
    def __init__(self, player=0):
        self.player = player
        self.updates = []
        self.step = 0


class AgentThread(Thread):
    def __init__(self, out_io: 'IO[bytes]', queue: 'Queue'):
        super().__init__(name='Agent Thread', daemon=True)
        self._queue = queue
        self._out_io = out_io

    def run(self) -> None:
        for line in iter(self._out_io.readline, b''):
            self._queue.put(line)
        self._out_io.close()


class AgentRunner:
    def __init__(self, command: 'list[str]', agent_processes: 'list[Popen[bytes]]', thread: 'Thread', queue: 'Queue'):
        self._agent_processes = agent_processes
        self._agent_thread = thread
        self._queue = queue
        self._command = command

    def run_agent(self, observation: 'Observation', configuration: 'Configuration') -> 'list[str]':
        agent_process = self._agent_processes[observation.player]
        if agent_process is None:
            agent_process = self.start_agent(observation, configuration)

        if observation.step == 0:
            # fixes bug where updates array is shared, but the first update is agent dependent actually
            observation["updates"][0] = f"{observation.player}"

        updates = ("\n".join(observation['updates']) + "\n").encode()
        agent_process.stdin.write(updates)
        agent_process.stdin.flush()

        agent_response = agent_process.stdout.readline().decode()
        _end_response = agent_process.stdout.readline().decode()

        while True:
            try:
                line = self._queue.get_nowait()
            except Empty:
                break
            else:
                print(line.decode(), file=sys.stderr, end='')

        commands = agent_response.split("\n")[0].split(",")
        actions = filter(lambda command: command != '', commands)

        return list(actions)

    def start_agent(self, observation: 'Observation', configuration: 'Configuration') -> 'Popen':
        agent_path = configuration["__raw_path__"] if "__raw_path__" in configuration else __file__
        agent_cwd = os.path.dirname(agent_path)

        agent_process = Popen(self._command, stdin=PIPE,
                              stdout=PIPE, stderr=PIPE, cwd=agent_cwd)
        self._agent_processes[observation.player] = agent_process

        self._queue = Queue()
        self._agent_thread = AgentThread(agent_process.stderr, self._queue)
        self._agent_thread.start()

        return agent_process

    def cleanup_processes(self) -> 'None':
        for proc in self._agent_processes:
            if proc is not None:
                proc.kill()


agent_processes = [None, None]
t = None
q = None

command = "./main.out"
agent_runner = AgentRunner(
    command=command, agent_processes=agent_processes, thread=t, queue=q)

atexit.register(lambda: agent_runner.cleanup_processes())


def command_agent(observation: 'Observation', configuration: 'Configuration') -> 'list[str]':
    return agent_runner.run_agent(observation, configuration)
