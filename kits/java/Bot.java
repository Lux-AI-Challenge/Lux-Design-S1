import lux.*;
public class Bot {
    public static void main(final String[] args) throws Exception {
        System.out.println("HELLO WORLD KAGGLE");
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
