using System;

namespace Bot.Lux
{
	public class GameMap
	{
		public int Width;
		public int Height;
		public Cell[][] Map;

		public GameMap(int width, int height)
		{
			Width = width; 
			Height = height;
			Map = new Cell[height][];

			for (var y = 0; y < Height; y++)
			{
				Map[y] ??= new Cell[width];
				for (var x = 0; x < Width; x++)
				{
					Map[y][x] = new Cell(x, y);
				}
			}
		}

		public Cell GetCellByPos(Position pos)
		{
			return Map[pos.Y][pos.X];
		}

		public Cell GetCell(int x, int y)
		{
			return Map[y][x];
		}

		/** Internal use only */
		public void SetResource(String rType, int x, int y, int amount)
		{
			var cell = GetCell(x, y);
			cell.Resource = new Resource(rType, amount);
		}
	}
}
