'use strict'

module.exports = function(express, services, aux, authization) {
    if (!services) {
        throw "Invalid services object";
    }
    const router = express.Router();
    const authenticate = authization.authenticate

    console.log(authenticate.usingLocal)

    router.post('/signup', signUp);
    router.post('/signin', authenticate.usingLocal, signIn);

    router.get('/:username', getUser);
    router.patch('/:username', updateUser);
    router.delete('/:username', deleteUser);

    return router;

    
    function signUp(req, res) {
        console.log("signUp in pg-users");
        const name = req.body.name? req.body.name : "";
        const surname = req.body.surname? req.body.surname :  "";

        aux.promisesAsyncImplementation(
            services.createUser(req.body.username, req.body.password,name,surname, 'users/'),
            res
        );
    }

    function signIn(req, res) {
        console.log("entrou")
        if(req.isAuthenticated()){
            res.send("Successfull login")
        }
        else{
            res.send("Something wrong with login")
        }
        
    }

    function getUser(req, res) {
        aux.promisesAsyncImplementation(
            services.getUser(req.params.username),
            res
        );
    }

    function updateUser(req, res) {
        aux.promisesAsyncImplementation(
            services.updateUser(req.params.username, req.params.firstName, req.params.lastName, req.params.email, req.params.password, 'users/'),
            res
        );
    }

    function deleteUser(req, res) {
        aux.promisesAsyncImplementation(
            services.deleteUser(req.params.username, 'users/'),
            res
        );
    }
}
