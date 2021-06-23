'use strict'

function services(databaseUsers, databaseGroups, pgResponses, authization) {
    const authUser = authization.user
    const serv = {
        createUser: function (username, password, name, surname, email) { //TODO
            var regExp = /[a-zA-Z]/g;
            if (!regExp.test(username)) {  //verify if username is a string
                return pgResponses.setError(
                    pgResponses.BAD_REQUEST,
                    pgResponses.BAD_REQUEST_MSG
                )
            }
            return authUser.create(username, password)
                .then(databaseUsers.createUser(username, name, surname, email))
                .then(() => {
                    return pgResponses.setSuccessUri(
                        pgResponses.CREATE,
                        pgResponses.index.users,
                        username,
                        ""
                    )
                })
                .catch(err => {
                    if (!err.body) err.body = err.errors[0].message
                    else this.deleteFromAuthization(username);
                    return pgResponses.setError(err.status, err.body)
                })
        },

        getUserAuthization: function (username) {
            return authUser.getByUsername(username)
                .then(userObj => {
                    return pgResponses.setSuccessList(
                        pgResponses.OK,
                        userObj
                    )
                })
                .catch(error => pgResponses.setError(error.status, error.body))
        },

        getUser: function (username) {
            return databaseUsers.getUser(username)
                .then(userObj => {
                    return pgResponses.setSuccessList(
                        pgResponses.OK,
                        userObj
                    )
                })
        },

        updateUser: function (username, updatedInfo) {
            return databaseUsers.getUser(username)
                .then(user => {
                    console.log(user)
                    user.info.forEach(info => {
                        if (!updatedInfo.info.find(i => i.type == info.type))
                            updatedInfo.info.push(info)
                    })
                    return databaseUsers.updateUser(user.username, updatedInfo)
                        .then(user_name => {
                            return pgResponses.setSuccessUri(
                                pgResponses.OK,
                                pgResponses.index.users,
                                user_name,
                                ""
                            )
                        })
                })
        },

        getUserNotifications: function (username) {
            return databaseUsers.getUser(username) //check if the user exists
                .then(user => {
                    return pgResponses.setSuccessList(
                        pgResponses.OK,
                        user.notifications
                    )
                })
        },

        removeUserNotification: function (username, group_id) {
            return databaseUsers.getUser(username) //check if the user exists
                .then(userObj => {
                    const notification_index = userObj.notifications.findIndex(n => n.group_id === group_id)  //get the notification's index
                    if (notification_index === -1) { //the notification doesnt exist in the user
                        return pgResponses.setError(
                            pgResponses.NOT_FOUND,
                            pgResponses.NOT_FOUND_USER_MSG
                        );
                    }
                    console.log(userObj)
                    return databaseUsers.removeUserNotification(userObj.id, notification_index) //remove the user by index
                        .then(() => {
                            return pgResponses.setSuccessUri(
                                pgResponses.OK,
                                pgResponses.index.users,
                                pgResponses.index.notifications,
                                username
                            )
                        })
                })
        },

        addMemberToGroup: function (group_id, member) {
            return databaseGroups.addMemberToGroup(group_id, member)
                .then(() => {
                    return pgResponses.setSuccessUri(
                        pgResponses.OK,
                        pgResponses.index.api,
                        pgResponses.index.groups,
                        group_id
                    )
                })
        },

        deleteFromAuthization: function (username) {
            return this.getUserAuthization(username)
                .then(user => authUser.delete(user.body.id))
                .catch(err => {
                    if (!err.body) err.body = err.error.errors[0].message;
                    return pgResponses.setError(err.status, err.body);
                })
        },

        deleteUser: function (username) {
            /**
             * TODO
             * delete this user from all groups
             */
            return this.deleteFromAuthization(username)
                .then(() => {
                    console.log("DELETE SERVICE");
                    return databaseUsers.deleteUser(username)
                        .then(user_name => {
                            return pgResponses.setSuccessUri(
                                pgResponses.OK,
                                pgResponses.index.users,
                                user_name,
                                ""
                            )
                        })
                })
        }
    }
    return serv;
}

module.exports = services;