
import rabbit from "./rabbit-mq/index";


function route(app) {
    // app.use(
    //     "/v1/api/socket-io",
    //     function (req, res, next) {
    //         next();
    //     },
    //     socket
    // );

    app.use(
        "/v1/api/rabbit-mq",
        function (req, res, next) {
            next();
        },
        rabbit
    );
}
export default route;