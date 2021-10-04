#ifndef city_h
#define city_h
#include <vector>
#include <string>
// #include <format>
#include "position.hpp"
namespace lux
{
    using namespace std;
    class CityTile
    {
    public:
        string cityid;
        int team;
        lux::Position pos;
        int cooldown;
        CityTile(){};
        CityTile(int teamid, const string &cityid, int x, int y, int cooldown)
        {
            this->cityid = cityid;
            this->team = teamid;
            
            this->pos = lux::Position(x, y);
            this->cooldown = cooldown;
        }
        /** Whether or not this unit can research or build */
        bool canAct()
        {
            return this->cooldown < 1;
        };
        /** returns command to ask this tile to research this turn */
        string research()
        {
            return "r " + to_string(this->pos.x) + " " + to_string(this->pos.y);

        };
        /** returns command to ask this tile to build a worker this turn */
        string buildWorker()
        {
            return "bw " + to_string(this->pos.x) + " " + to_string(this->pos.y);
        }
        /** returns command to ask this tile to build a cart this turn */
        string buildCart()
        {
            return "bc " + to_string(this->pos.x) + " " + to_string(this->pos.y);
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
        City(int teamid, const string &cityid, float fuel, float lightUpkeep) : cityid(cityid), team(teamid), fuel(fuel), lightUpkeep(lightUpkeep) {}
        void addCityTile(int x, int y, int cooldown)
        {
            citytiles.emplace_back(team, cityid, x, y, cooldown);
        }
        float getLightUpkeep()
        {
            return this->lightUpkeep;
        }
    };
}
#endif