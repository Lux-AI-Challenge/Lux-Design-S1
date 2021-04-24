// source ../LuxAI/transpilers/emsdk/emsdk_env.sh
// emcc -s FORCE_FILESYSTEM=1 --pre-js init_fs.js hello.cpp
#include <string>
#include <iostream>
using namespace std; 
namespace kit {

    static string getline() {
        // exit if stdin is bad now
        if (!std::cin.good()) exit(0);

        char str[2048], ch;
        int i = 0;
        ch = getchar();
        while (ch != '\n') {
            str[i] = ch;
            i++;
            ch = getchar();
        }

        str[i] = '\0';
        // return the line
        return string(str);
    }
    

    class Agent {
        public:
        int id;
        int max_rounds;
        Agent() {

        }
        /**
         * Initialize Agent for the `Match`
         * User should edit this according to their `Design`
         */
        void initialize() {
            // get agent ID
            id = stoi(kit::getline());
            // get some other necessary initial input
            string input = kit::getline();
        }
        // end a turn
        static void end_turn() {
            cout << "D_FINISH" << std::endl << std::flush;
        }

        /**
         * Updates agent's own known state of `Match`.
         * User should edit this according to their `Design`.
         */
        static void update() {
            std:string updateInfo = kit::getline();
        }
    };
    
}

