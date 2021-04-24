#ifndef position_h
#define position_h
#include <vector>
namespace lux {
class Position
    {
    public:
        int x = -1;
        int y = -1;
        Position() {}
        Position(int x, int y)
        {
            this->x = x;
            this->y = y;
        }
        bool isAdjacent(const Position &pos)
        {
            const int dx = this->x - pos.x;
            const int dy = this->y - pos.y;
            if (abs(dx) + abs(dy) > 1)
            {
                return false;
            }
            return true;
        }
        bool operator==(const Position &pos)
        {
            return this->x == pos.x && this->y == pos.y;
        }

        // TODO: implement

        // translate(direction, units) {
        //     switch (direction) {
        //     case DIRECTIONS.NORTH:
        //         return new Position(this.x, this.y - units);
        //     case DIRECTIONS.EAST:
        //         return new Position(this.x + units, this.y);
        //     case DIRECTIONS.SOUTH:
        //         return new Position(this.x, this.y + units);
        //     case DIRECTIONS.WEST:
        //         return new Position(this.x - units, this.y);
        //     }
        // }

        /** Returns distance to pos from this position */
        // distanceTo(pos) {
        //     const dx = pos.x - this.x;
        //     const dy = pos.y - this.y;
        //     return Math.sqrt(dx * dx + dy * dy);
        // }

        // /** Returns closest direction to targetPos, or null if staying put is best */
        // directionTo(targetPos) {
        //     const checkDirections = [
        //     DIRECTIONS.NORTH,
        //     DIRECTIONS.EAST,
        //     DIRECTIONS.SOUTH,
        //     DIRECTIONS.WEST,
        //     ];
        //     let closestDirection = null;
        //     let closestDist = this.distanceTo(targetPos);
        //     checkDirections.forEach((dir) => {
        //     const newpos = this.translate(dir, 1);
        //     const dist = targetPos.distanceTo(newpos);
        //     if (dist < closestDist) {
        //         closestDist = dist;
        //         closestDirection = dir;
        //     }
        //     });
        //     return closestDirection;
        // }
    };
}
#endif