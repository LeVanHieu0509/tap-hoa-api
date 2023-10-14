import { getConnectionManager } from "typeorm";
import os from "os";
import process from "process";

const _SECOND = 30000;
//check số lượng connect của một user truy vấn tới database
export function countConnect() {
  const connectionManager = getConnectionManager();
  const connections = connectionManager.connections;
  const numberOfConnections = connections.length;

  return numberOfConnections;
}

//check over load of connection - check sự quá tải của một connect
//Không nên làm việc tối da phải chừa một khoang thời gian để hệ thống nó báo để có thể vào kubenetis và docker để sử dụng: xem lại video
// Giả sử một core cpu có thể kết nối được bao nhiêu: Do dựa vào bộ nhớ, memory, tính chất cộng việc của job đó ... ko thể quản lý được số lượng kết nối đồng thời
// CPU Overload rất là ghê
// Nên theo dõi lượng kết nối và điều chỉnh lại lượng kết nối cho nó phù hợp hơn để database nó hoạt động tốt.

// Có nên đóng connect database không?: Chúng ta sử dụng cái pool xử lý mở và đóng db khi cần.
// Muốn đóng kêt nối: Tắt all csdl đang hoạt động đảm bảo database không bị mất.
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length; //số lượng CPU trên hệ thống
    const memoryUsage = process.memoryUsage().rss; //để lấy thông tin về bộ nhớ sử dụng hiện tại của ứng dụng và in ra thông tin này.

    //example maximum number of connections based on number osf cores
    const maxConnections = numCores * 5; //5 kết nối trên mỗi core

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log("Connection overload detected");
    }
  }, _SECOND);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
