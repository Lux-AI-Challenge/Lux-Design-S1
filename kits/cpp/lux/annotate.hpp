// TODO: implement annotation commands
// const annotate = {
//   circle: (x, y) => {
//     return `dc ${x} ${y}`
//   },
//   x: (x, y) => {
//     return `dx ${x} ${y}`
//   },
//   line: (x1, y1, x2, y2) => {
//     return `dl ${x1} ${y1} ${x2} ${y2}`
//   }
// }
#include <string>
using namespace std;
namespace lux {
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