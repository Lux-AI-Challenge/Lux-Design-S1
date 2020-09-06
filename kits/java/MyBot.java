import kit.*;
public class MyBot {
    public static void main(final String[] args) throws Exception {
        Agent agent = new Agent();

        while(true) {
            // wait for updates
            agent.update();
            // send some commands
            System.out.println("some command, another command");
            // end turn
            agent.endTurn();
            
        }
    }
}
