using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

class PreviewServer {
 static string root;
 static readonly Encoding Utf8 = new UTF8Encoding(false);
 static int Main(string[] args) {
  Console.OutputEncoding = Utf8;
  Console.Title = "БЕЗ КОРНЕЙ — локальный сервер";
  root = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "bez-korney-preview"));
  if (!File.Exists(Path.Combine(root,"index.html"))) { Console.WriteLine("Не найдена папка bez-korney-preview с index.html рядом с программой."); Pause(); return 1; }
  if (args.Length > 0 && args[0] == "--check") {
   if (Resolve("/../AGENTS.md") != null || Resolve("/%2e%2e/AGENTS.md") != null || Resolve("/index.html") == null) return 2;
   Console.WriteLine("Проверка файлов и ограничения путей: OK"); return 0;
  }
  TcpListener server = null; int port = 8765;
  try {
   for (; port <= 8775; port++) {
    server = new TcpListener(IPAddress.Loopback, port);
    try { server.Start(); break; } catch (SocketException ex) { server.Stop(); if (ex.SocketErrorCode != SocketError.AddressAlreadyInUse) throw; }
   }
   if(port > 8775) throw new IOException("Порты 8765–8775 заняты. Закройте лишние окна сервера.");
   Console.WriteLine("БЕЗ КОРНЕЙ — сервер работает\n");
   Console.WriteLine("Адрес: http://127.0.0.1:" + port + "/\n");
   Console.WriteLine("Оставьте это окно открытым.\nДля остановки закройте окно или нажмите Ctrl+C.");
   Console.WriteLine("\nПапка сайта: " + root);
   while (true) { TcpClient client = server.AcceptTcpClient(); Task.Run(() => Serve(client)); }
  } catch (Exception ex) { Console.WriteLine("Не удалось запустить сервер: " + ex.Message); Pause(); return 1; }
 }
 static void Pause() { Console.WriteLine("\nНажмите Enter, чтобы закрыть окно."); Console.ReadLine(); }
 static string Resolve(string target) {
  try {
   string url = Uri.UnescapeDataString(target.Split('?')[0]);
   if(!url.StartsWith("/") || url.IndexOf('\\') >= 0 || url.IndexOf(':') >= 0 || url.IndexOf('\0') >= 0) return null;
   string file = Path.GetFullPath(Path.Combine(root, url == "/" ? "index.html" : url.TrimStart('/').Replace('/',Path.DirectorySeparatorChar)));
   return file.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) ? file : null;
  } catch { return null; }
 }
 static string Mime(string p) {
  switch(Path.GetExtension(p).ToLowerInvariant()) {
   case ".html": return "text/html; charset=utf-8";
   case ".css": return "text/css; charset=utf-8";
   case ".js": return "application/javascript; charset=utf-8";
   case ".svg": return "image/svg+xml";
   case ".png": return "image/png";
   case ".jpg": case ".jpeg": return "image/jpeg";
   case ".gif": return "image/gif";
   case ".webp": return "image/webp";
   case ".woff2": return "font/woff2";
   case ".ttf": return "font/ttf";
   case ".mp4": return "video/mp4";
   default: return "application/octet-stream";
  }
 }
 static void Reply(NetworkStream stream, int code, string reason, string type, byte[] data, bool head) {
  byte[] headers = Utf8.GetBytes("HTTP/1.1 " + code + " " + reason + "\r\nContent-Type: " + type + "\r\nContent-Length: " + data.Length + "\r\nCache-Control: no-store\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\n\r\n");
  stream.Write(headers,0,headers.Length); if(!head) stream.Write(data,0,data.Length);
 }
 static void Serve(TcpClient client) {
  using(client) { try {
   client.ReceiveTimeout=4000; client.SendTimeout=10000;
   using(NetworkStream stream=client.GetStream()) {
    // Bound headers so a stalled or malformed connection cannot grow indefinitely.
    var bytes=new MemoryStream(); int b, state=0;
    while(bytes.Length<16384 && (b=stream.ReadByte())!=-1) {
     bytes.WriteByte((byte)b);
     state = (state==0 && b==13) ? 1 : (state==1 && b==10) ? 2 : (state==2 && b==13) ? 3 : (state==3 && b==10) ? 4 : 0;
     if(state==4) break;
    }
    string[] first=Utf8.GetString(bytes.ToArray()).Split(new[]{"\r\n"},StringSplitOptions.None)[0].Split(' ');
    if(state!=4 || first.Length!=3) { Reply(stream,400,"Bad Request","text/plain",Utf8.GetBytes("Bad request"),false);return; }
    bool head=first[0]=="HEAD";
    if(first[0]!="GET"&&!head) { Reply(stream,405,"Method Not Allowed","text/plain",new byte[0],false);return; }
    string file=Resolve(first[1]);
    if(file==null) { Reply(stream,403,"Forbidden","text/plain",new byte[0],head);return; }
    if(!File.Exists(file)) { Reply(stream,404,"Not Found","text/plain",Utf8.GetBytes("Not found"),head);return; }
    Reply(stream,200,"OK",Mime(file),File.ReadAllBytes(file),head);
   }
  } catch { /* A closed browser connection is harmless. */ } }
 }
}
