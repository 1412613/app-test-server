"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const PORT = process.env.PORT || 4000;
App_1.default.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Express server listening on port', PORT);
    }
});
//# sourceMappingURL=server.js.map