<?php
include(__DIR__ . "/kit.php");

$agent = new Agent();

// initialize the agent
$agent->initialize();

while(true) {
    // wait for engine updates
    $agent->update();
    // send some commands
    print "some command, another command\n";
    // end turn
    $agent->end_turn();
}