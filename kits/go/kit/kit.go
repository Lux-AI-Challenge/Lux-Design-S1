package kit
import "fmt"

type Agent struct {
	id int
}

/**
 * Initialize Agent for the `Match`
 * User should edit this according to their `Design`
 */
func (agent Agent) Initialize() {
	var id int
	// get agent ID
	fmt.Scanf("%d", &id)
	agent.id = id
	// get some other necessary initial input
	var input string
	fmt.Scanf("%s", &input)
}

/**
 * Updates agent's own known state of `Match`
 * User should edit this according to their `Design`.
 */
func (agent Agent) Update() {
	var updates string
	// wait for the engine to send any updates
	fmt.Scanf("%s", &updates)
}

/**
 * End a turn
 */
func (agent Agent) EndTurn() {
	fmt.Printf("D_FINISH\n");
}