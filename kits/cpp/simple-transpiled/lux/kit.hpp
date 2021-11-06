// source ../LuxAI/transpilers/emsdk/emsdk_env.sh
// emcc -s FORCE_FILESYSTEM=1 --pre-js init_fs.js hello.cpp
#ifndef kit_h
#define kit_h
#include <ostream>
#include <string>
#include <iostream>
#include <vector>
#include "map.hpp"
#include "lux_io.hpp"
#include "game_objects.hpp"
#include "annotate.hpp"
#include "city.hpp"

namespace kit
{
    using namespace std;

    static string getline()
    {
        // exit if stdin is bad now
        if (!cin.good())
            exit(0);

        char str[2048], ch;
        int i = 0;
        ch = getchar();
        while (ch != '\n')
        {
            str[i] = ch;
            i++;
            ch = getchar();
        }

        str[i] = '\0';
        // return the line
        return string(str);
    }

    static vector<string> tokenize(string s, string del = " ")
    {
        vector<string> strings = vector<string>();
        int start = 0;
        int end = s.find(del);
        while (end != -1)
        {
            strings.push_back(s.substr(start, end - start));
            start = end + del.size();
            end = s.find(del, start);
        }
        strings.push_back(s.substr(start, end - start));
        return strings;
    }

    class Agent
    {
    public:
        int id;
        int turn = -1;
        int mapWidth = -1;
        int mapHeight = -1;
        lux::GameMap map;
        lux::Player players[2] = {lux::Player(0), lux::Player(1)};
        Agent()
        {
        }
        /**
         * Initialize Agent for the `Match`
         * User should edit this according to their `Design`
         */
        void initialize()
        {
            // get agent ID
            id = stoi(kit::getline());
            string map_info = kit::getline();

            vector<string> map_parts = kit::tokenize(map_info, " ");

            mapWidth = stoi(map_parts[0]);
            mapHeight = stoi(map_parts[1]);

            map = lux::GameMap(mapWidth, mapHeight);
        }
        // end a turn
        static void end_turn()
        {
            cout << "D_FINISH" << endl
                 << std::flush;
        }

        /**
         * Updates agent's own known state of `Match`.
         * User should edit this according to their `Design`.
         */
        void update()
        {
            turn++;
            resetPlayerStates();
            map = lux::GameMap(mapWidth, mapHeight);

            while (true)
            {
                string updateInfo = kit::getline();
                if (updateInfo == INPUT_CONSTANTS::DONE)
                {
                    break;
                }
                vector<string> updates = kit::tokenize(updateInfo, " ");
                string input_identifier = updates[0];
                if (input_identifier == INPUT_CONSTANTS::RESEARCH_POINTS)
                {
                    int team = stoi(updates[1]);
                    players[team].researchPoints = stoi(updates[2]);
                }
                else if (input_identifier == INPUT_CONSTANTS::RESOURCES)
                {
                    string type = updates[1];
                    int x = stoi(updates[2]);
                    int y = stoi(updates[3]);
                    int amt = stoi(updates[4]);
                    lux::ResourceType rtype = lux::ResourceType(type.at(0));
                    map._setResource(rtype, x, y, amt);
                }
                else if (input_identifier == INPUT_CONSTANTS::UNITS)
                {
                    int i = 1;
                    int unittype = stoi(updates[i++]);
                    int team = stoi(updates[i++]);
                    string unitid = updates[i++];
                    int x = stoi(updates[i++]);
                    int y = stoi(updates[i++]);
                    float cooldown = stof(updates[i++]);
                    int wood = stoi(updates[i++]);
                    int coal = stoi(updates[i++]);
                    int uranium = stoi(updates[i++]);
                    lux::Unit unit = lux::Unit(team, unittype, unitid, x, y, cooldown, wood, coal, uranium);
                    players[team].units.push_back(unit);
                }
                else if (input_identifier == INPUT_CONSTANTS::CITY)
                {
                    int i = 1;
                    int team = stoi(updates[i++]);
                    string cityid = updates[i++];
                    float fuel = stof(updates[i++]);
                    float lightUpkeep = stof(updates[i++]);
                    players[team].cities[cityid] = lux::City(team, cityid, fuel, lightUpkeep);
                }
                else if (input_identifier == INPUT_CONSTANTS::CITY_TILES)
                {
                    int i = 1;
                    int team = stoi(updates[i++]);
                    string cityid = updates[i++];
                    int x = stoi(updates[i++]);
                    int y = stoi(updates[i++]);
                    float cooldown = stof(updates[i++]);
                    lux::City * city = &players[team].cities[cityid];
                    city->addCityTile(x, y, cooldown);
                    players[team].cityTileCount += 1;
                }
                else if (input_identifier == INPUT_CONSTANTS::ROADS)
                {
                    int i = 1;
                    int x = stoi(updates[i++]);
                    int y = stoi(updates[i++]);
                    float road = stof(updates[i++]);
                    lux::Cell * cell = map.getCell(x, y);
                    cell->road = road;
                }
            }
            for (lux::Player &player : players)
            {
                for (auto &element : player.cities)
                {
                    lux::City &city = element.second;
                    for (lux::CityTile &citytile : city.citytiles)
                    {
                        const lux::Position &pos = citytile.pos;
                        map.getCell(pos.x, pos.y)->citytile = &citytile;
                    }
                }
            }
        }

    private:
        void resetPlayerStates()
        {
            for (int team = 0; team < 2; team++)
            {
                players[team].units.clear();
                players[team].cities.clear();
                players[team].cityTileCount = 0;
            }
        }
    };
}

#endif
