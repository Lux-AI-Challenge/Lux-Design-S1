#ifndef annotate_h
#define annotate_h
#include <string>
namespace lux {
  using namespace std;
  class Annotate {
    public:
    static string circle(int x, int y) {
      return "dc " + to_string(x) + " " + to_string(y);
    };
    static string x(int x, int y) {
      return "dx " + to_string(x) + " " + to_string(y);
    };
    static string line(int x1, int y1, int x2, int y2) {
      return "dl " + to_string(x1) + " " + to_string(y1) + " " +  to_string(x2) + " " + to_string(y2);
    };
  };
};
// string lux::Annotate::circle(int x, int y) 


#endif
