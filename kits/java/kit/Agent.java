package kit;

import java.util.Scanner;

public class Agent {
    private final Scanner scanner;
    public int id;

    /**
     * Constructor for a new agent User should edit this according to their `Design`
     */
    public Agent() {
      scanner = new Scanner(System.in);
    }

    /**
     * Initialize Agent for the `Match` User should edit this according to their
     * `Design`
     */
    public void initialize() {
      // get agent ID
      id = scanner.nextInt();
      // get some other necessary initial input
      final String input = scanner.nextLine();
    }

    /**
     * Updates agent's own known state of `Match` User should edit this according to
     * their `Design`.
     */
    public void update() {
      // wait for the engine to send any updates
      final String updates = scanner.nextLine();
    }
    /**
     * End a turn
     */
    public void endTurn() {
        System.out.println("D_FINISH");
        System.out.flush();
    }
}