#ifndef position_h
#define position_h
#include <cmath>
#include <ostream>
#include <vector>
#include <string>
#include "constants.hpp"

namespace lux
{
    using namespace std;

    class Position
    {
    public:
        int x = -1;
        int y = -1;

        Position() {}
        Position(int x, int y) : x(x), y(y) {}

        /** Returns true if pos is adjacent in x or y direction or if pos is the same */
        bool isAdjacent(const Position &pos) const
        {
            const int dx = x - pos.x;
            const int dy = y - pos.y;
            return (abs(dx) + abs(dy)) <= 1;
        }

        bool operator==(const Position &pos) const noexcept
        {
            return x == pos.x && y == pos.y;
        }
        bool operator!=(const Position &pos) const noexcept
        {
            return !(operator==(pos));
        }

        /** Returns a new position created by applying direction units number of times. Does not modify this itself */
        Position translate(const DIRECTIONS &direction, int units) const
        {
            switch (direction)
            {
            case DIRECTIONS::NORTH:
                return Position(x, y - units);
            case DIRECTIONS::EAST:
                return Position(x + units, y);
            case DIRECTIONS::SOUTH:
                return Position(x, y + units);
            case DIRECTIONS::WEST:
                return Position(x - units, y);
            case DIRECTIONS::CENTER:
                return Position(x, y);
            }
        }

        /** Returns Manhattan distance to pos from this position */
        float distanceTo(const Position &pos) const
        {
            return abs(pos.x - x) + abs(pos.y - y);
        }

        /** Returns closest direction to targetPos, or center if staying put is best */
        DIRECTIONS directionTo(const Position &targetPos) const
        {

            DIRECTIONS closestDirection = DIRECTIONS::CENTER;
            float closestDist = distanceTo(targetPos);
            for (const DIRECTIONS dir : ALL_DIRECTIONS)
            {
                const Position newpos = translate(dir, 1);
                float dist = targetPos.distanceTo(newpos);
                if (dist < closestDist)
                {
                    closestDist = dist;
                    closestDirection = dir;
                }
            }
            return closestDirection;
        }

        friend ostream &operator<<(ostream &out, const Position &p);

        operator string() const
        {
            return "(" + to_string(x) + ", " + to_string(y) + ")";
        }
    };

    ostream &operator<<(ostream &out, const Position &p);
}

#endif
