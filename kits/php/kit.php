<?php
class Agent {
    public $id;
    function  __construct () {

    }

    /**
     * Initialize Agent for the `Match`
     * User should edit this according to their `Design`
     */
    function initialize() {
        fscanf(STDIN, "%d\n", $id);
    }

    /**
     * Updates agent's own known state of `Match`.
     * User should edit this according to their `Design`.
     */
    function update() {
        fscanf(STDIN, "%s\n", $updates);
    }
    
    // end turn
    function end_turn() {
        print "D_FINISH\n";
        flush();
    }
}