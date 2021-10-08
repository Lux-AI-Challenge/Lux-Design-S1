namespace Bot.Lux
{
	public class Resource
	{
		public string Type;
		public int Amount;

		public Resource(string type, int amt)
		{
			Type = type;
			Amount = amt;
		}
	}
}
