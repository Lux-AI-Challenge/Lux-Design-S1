#include <stdio.h>
#include <stdlib.h>
struct Agent {
    int id;
    int max_rounds;
};
struct Agent * agent;

/**
 * Initialize Agent for the `Match`
 * User should edit this according to their `Design`
 */
void agent_initialize() {
    agent = (struct Agent *) malloc(sizeof(struct Agent));
    int id;
    // get agent ID
    fscanf(stdin, "%d", &id);
    agent->id = id; // store it
    // get some other necessary initial input
    char input[128];
    fscanf(stdin, "%s", &input);
    
}

// End a turn
void agent_end_turn() {
    // print D_FINISH to mark end of turn
    printf("D_FINISH\n");
    // flush it all out
    fflush(stdout);
}

/**
 * Updates agent's own known state of `Match`.
 * User should edit this according to their `Design`.
 */
void agent_update() {
    char updateInfo[128];
    fscanf(stdin, "%d", &updateInfo);
}
