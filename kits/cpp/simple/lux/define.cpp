#include "kit.hpp"
#include <map>
#include <string>

namespace kit
{
  using namespace std;
  string INPUT_CONSTANTS::DONE = "D_DONE";
  string INPUT_CONSTANTS::RESOURCES = "r";
  string INPUT_CONSTANTS::RESEARCH_POINTS = "rp";
  string INPUT_CONSTANTS::UNITS = "u";
  string INPUT_CONSTANTS::CITY = "c";
  string INPUT_CONSTANTS::CITY_TILES = "ct";
  string INPUT_CONSTANTS::ROADS = "ccd";
}

namespace lux 
{

	ostream &operator<<(ostream &out, const Position &p)
	{
		out << "(" << p.x << "," << p.y << ")"; // access private data
		return out;
	};
}
