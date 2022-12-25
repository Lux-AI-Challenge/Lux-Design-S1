namespace Bot.Lux
{
	public class Unit
	{
		public Position Pos;
		public int Team;
		public string Id;
		public int Type;
		public double Cooldown;
		public Cargo Cargo;

		public Unit(int teamId, int type, string unitId, int x, int y, double cooldown, int wood, int coal, int uranium)
		{
			Pos = new Position(x, y);
			Team = teamId;
			Id = unitId;
			Type = type;
			Cooldown = cooldown;
			Cargo = new Cargo(wood, coal, uranium);
		}

		public bool IsWorker()
		{
			return Type == 0;
		}

		public bool IsCart()
		{
			return Type == 1;
		}

		public int GetCargoSpaceLeft()
		{
			var spaceUsed = Cargo.Wood + Cargo.Coal + Cargo.Uranium;
			if (Type == GameConstants.UNIT_TYPES.WORKER)
			{
				return GameConstants.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceUsed;
			}

			return GameConstants.PARAMETERS.RESOURCE_CAPACITY.CART - spaceUsed;
		}

		public bool CanBuild(GameMap gameMap)
		{
			var cell = gameMap.GetCellByPos(Pos);
			return !cell.HasResource() && CanAct() && 
			       Cargo.Wood + Cargo.Coal + Cargo.Uranium >= GameConstants.PARAMETERS.CITY_BUILD_COST;
		}

		public bool CanAct()
		{
			return Cooldown < 1;
		}

		public string Move(string dir)
		{
			return $"m {Id} {dir}";
		}

		public string Transfer(string destId, string resourceType, int amount)
		{
			return $"t {Id} {destId} {resourceType} {amount}";
		}

		public string BuildCity()
		{
			return $"bcity {Id}";
		}

		public string Pillage()
		{
			return $"p {Id}";
		}
	}
}
