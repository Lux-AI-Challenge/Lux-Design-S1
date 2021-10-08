using System;

namespace Bot.Lux
{
	public class Position
	{
		public int X;
		public int Y;

		public Position(int x, int y)
		{
			X = x;
			Y = y;
		}

		public bool IsAdjacent(Position pos)
		{
			var dx = X - pos.X;
			var dy = Y - pos.Y;

			return Math.Abs(dx) + Math.Abs(dy) <= 1;
		}

		public bool Equals(Position pos)
		{
			return X == pos.X && Y == pos.Y;
		}

		public Position Translate(string direction, int units)
		{
			return direction switch
			{
				Direction.NORTH => new Position(X, Y - units),
				Direction.EAST => new Position(X + units, Y),
				Direction.SOUTH => new Position(X, Y + units),
				Direction.WEST => new Position(X - units, Y),
				Direction.CENTER => new Position(X, Y),
				_ => throw new Exception("Did not supply valid direction")
			};
		}

		public double DistanceTo(Position pos)
		{
			return Math.Abs(pos.X - X) + Math.Abs(pos.Y - Y);
		}
		
		public string DirectionTo(Position targetPos)
		{
			var checkDirections = new []{ Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST, };
			var closestDirection = Direction.CENTER;
			var closestDist = DistanceTo(targetPos);

			foreach(var dir in checkDirections)
			{
				var newPos = Translate(dir, 1);
				var dist = targetPos.DistanceTo(newPos);
				if (!(dist < closestDist)) continue;
				closestDist = dist;
				closestDirection = dir;
			}

			return closestDirection;
		}

		public override string ToString()
		{
			return "(" + X + ", " + Y + ")";
		}
	}
}
