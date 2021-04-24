#ifndef game_objects_h
#define game_objects_h
#include <vector>
#include "map.hpp"
#include "position.hpp"
#include "constants.hpp"
using namespace std;
namespace lux
{
    class Cargo {
        public:
        int wood = 0;
        int coal = 0;
        int uranium = 0;
        Cargo() {};
    };
    class Unit
    {
        public:
        lux::Position pos;
        int team;
        string id;
        int type;
        int cooldown;
        Cargo cargo;
        Unit() {};
        Unit(int teamid, int type, string unitid, int x, int y, int cooldown, int wood, int coal, int uranium) {
            this->pos = lux::Position(x, y);
            this->team = teamid;
            this->id = unitid;
            this->type = type;
            this->cooldown = cooldown;
            this->cargo.wood = wood;
            this->cargo.coal = wood;
            this->cargo.uranium = uranium;
        };
        bool isWorker() {
            return this->type == 0;
        }
        bool isCart() {
            return this->type == 1;
        }
        int getCargoSpaceLeft() {
            int spaceused = this->cargo.wood + this->cargo.coal + this->cargo.uranium;
            if (this->type == 0) {
                // TODO: Use json constants
                return 50 - spaceused;
                // return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceused;
            } else {
                return 500 - spaceused;
                // return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.CART - spaceused;
            }
        }

        /** whether or not the unit can move or not */
        bool canMove() {
            return this->cooldown == 0;
        }

        /** return the command to move unit in the given direction */
        string move(char dir) {
            return "m " + this->id + " " + dir;
        }

        /** return the command to transfer a resource from a source unit to a destination unit as specified by their ids or the units themselves */
        string transfer(string src_unit_id, string dest_unit_id, lux::ResourceType resourceType, int amount) {
            return "t " + src_unit_id + " " + dest_unit_id + " " + to_string(resourceType) + " " + to_string(amount);
        }

        /** return the command to build a city right under the worker */
        string buildCity() {
            return "bcity " + this->id;
        }

        /** return the command to pillage whatever is underneath the worker */
        string pillage() {
            return "p " + this->id;
        }

    };
    class Player
    {
    public:
        int research_points = 0;
        int team = -1;
        vector<Unit> units;
        map<string, City> cities;
        Player(){};
        Player(int team_id){
            team = team_id;
            cities = map<string, City>();
            units = vector<Unit>();
        };
        // TODO: implement
        // researchedCoal() {
        //     return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
        // }
        // researchedUranium() {
        //     return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
        // }
    };
};
#endif