#ifndef map_h
#define map_h
#include <vector>
#include "city.hpp"
#include "position.hpp"
using namespace std;
namespace lux
{
    enum ResourceType
    {
        wood = 'w',
        coal = 'c',
        uranium = 'u'
    };
    class Resource
    {
    public:
        ResourceType type;
        int amount;
    };
    class Cell
    {
    public:
        Position pos = Position(-1, -1);
        Resource resource;
        lux::CityTile citytile;
        float cooldown = 1.0;
        Cell(){};
        Cell(int x, int y)
        {
            pos = Position(x, y);
        };
    };
    class GameMap
    {
    public:
        int width = -1;
        int height = -1;
        vector<vector<Cell> > map;
        GameMap(){};
        GameMap(int width, int height)
        {
            this->width = width;
            this->height = height;
            map = vector<vector<Cell> >(height, vector<Cell>(width));
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    map[y][x] = Cell(x, y);
                }
            }
        };
        Cell getCellByPos(const Position &pos)
        {
            return this->map[pos.y][pos.x];
        }
        Cell getCell(int x, int y)
        {
            return this->map[y][x];
        }
        void _setResource(ResourceType type, int x, int y, int amount)
        {
            Cell cell = this->getCell(x, y);
            cell.resource = Resource();
            cell.resource.amount = amount;
            cell.resource.type = type;
        }
    };

};
#endif