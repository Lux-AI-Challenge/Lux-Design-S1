package lux;

public class Annotate {
  public static String circle(int x, int y) {
    return "dc " + x + " " + y;
  }
  public static String x(int x, int y) {
    return "dx " + x + " " + y;
  }
  public static String line(int x1, int y1, int x2, int y2) {
    return "dl " + x1 + " " + y1 + " " + x2 + " " + y2;
  }
  public static String text(int x1, int y1, String message) {
    return "dt " + x1 + " " + y1 + " 16 '" + message + "'";
  }
  public static String text(int x1, int y1, String message, int fontsize) {
    return "dt " + x1 + " " + y1 +  " " + fontsize + " '" + message + "'";
  }
  public static String sidetext(String message) {
    return "dst '" + message + "'";
  }
}