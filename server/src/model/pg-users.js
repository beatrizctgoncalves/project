'use strict'


const clientPage = 'http://localhost:8081/googleAuth/';

module.exports = function (express, services, aux, authization) {
    if (!services) {
        throw "Invalid services object";
    }
    const router = express.Router();
    const authenticate = authization.authenticate
    const auth = authization.authorization

    router.post('/signup', signUp);
    router.post('/signin', async (req, res, next) => {
        await authenticate.usingLocal(req, res, err => {
            if (err) {
                const myError = {
                    status: err.status,
                    body: err.message
                }
                res.statusCode = err.status
                res.json({ error: myError })
            }
            next();
        })
    }, signIn);
    router.post('/logout', authenticate.logout, logOut);

    router.get('/:username', getUser);
    router.patch('/:username', updateUser);
    router.delete('/:username', deleteUser);

    router.get('/google/signIn', authenticate.usingGoogle)

    router.get('/google/callback', authenticate.usingGoogleCallback, successCallback)

    return router;


    function signUp(request, res) {
        const username = request.body.username;
        const password = request.body.password;
        const name = request.body.name;
        const surname = request.body.surname;
        const email = request.body.email;

        aux.promisesAsyncImplementation(
            services.createUser(username, password, name, surname, email),
            res
        );
    }

    function signIn(req, res) {
        const username = req.body.username
        services.getUser(username)
            .catch(err => {
                res.statusCode = err.status
                res.json({ error: err })
            })

        if (req.isAuthenticated()) {
            res.json({ message: "Successfull SignIn" })
        } else {
            res
        }
    }

    function logOut(req, res) {
        if (!req.isAuthenticated()) {
            res.json({ message: "Successfull logout" })
        } else {
            res.json({ message: "Something wrong with logout" })
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
            services.updateUser(req.params.username, req.body.updatedInfo),
            res
        );
    }

    function deleteUser(req, res) {
        aux.promisesAsyncImplementation(
            services.deleteUser(req.params.username),
            res
        );
    }

    function successCallback(req, res) {
        if (req.isAuthenticated()) {
            let username = req.user.username;
            const name = req.user.username.split(' ');

            services.getUser(username)
                .then(() => res.redirect(clientPage.concat(username)))
                .catch(() => {
                    services.createUserElastic(username, name[0], name[1], null)
                        .then(() => res.redirect(clientPage.concat(username)))
                })
        } else {
            res.json({ message: "Something wrong with Sign In" })
        }
    }
}
