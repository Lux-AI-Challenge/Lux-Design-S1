#ifndef city_h
#define city_h
#include <vector>
#include <string>
#include "position.hpp"

namespace lux
{
    using namespace std;

    class CityTile
    {
    public:
        string cityid;
        int team;
        Position pos;
        int cooldown;

        CityTile(){};
        CityTile(int teamid, const string &cityid, int x, int y, int cooldown)
        : cityid(cityid)
        , team(teamid)
        , pos(x, y)
        , cooldown(cooldown) {}

        /** Whether or not this unit can research or build */
        bool canAct() const
        {
            return cooldown < 1;
        }

        /** returns command to ask this tile to research this turn */
        string research() const
        {
            return "r " + to_string(pos.x) + " " + to_string(pos.y);

        }

        /** returns command to ask this tile to build a worker this turn */
        string buildWorker() const
        {
            return "bw " + to_string(pos.x) + " " + to_string(pos.y);
        }

        /** returns command to ask this tile to build a cart this turn */
        string buildCart() const
        {
            return "bc " + to_string(pos.x) + " " + to_string(pos.y);
        }
    };

    class City
    {
    public:
        string cityid;
        int team;
        float fuel;
        vector<CityTile> citytiles{};
        float lightUpkeep;

        City(){};
        City(int teamid, const string &cityid, float fuel, float lightUpkeep)
        : cityid(cityid)
        , team(teamid)
        , fuel(fuel)
        , lightUpkeep(lightUpkeep) {}

        void addCityTile(int x, int y, int cooldown)
        {
            citytiles.emplace_back(team, cityid, x, y, cooldown);
        }

        float getLightUpkeep() const
        {
            return lightUpkeep;
        }
    };
}
#endif
