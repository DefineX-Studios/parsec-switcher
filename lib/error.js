
const error =
    {
        SUCCESS : 0,
        PARSECD_NOT_IN_DEFAULT : 1,
        STOP_FAILED : 2,
        NICKNAME_EXITS : 3,
        START_ERROR : 4,
        FILE_DELETE_ERROR : 5,
        FOLDER_DELETE_ERROR : 6,
        MOVE_FILE_ERROR : 7,
        MAKE_DIR_ERROR : 8,
        NICKNAME_NOT_EXISTS : 9
    }

const errorToMessageArr = [
    [error.SUCCESS,                 "success"],
    [error.PARSECD_NOT_IN_DEFAULT,  "parsecd not in default location"],
    [error.STOP_FAILED,             "Stopping parsec process failed"],
    [error.NICKNAME_EXITS,          "Nickname already exists"],
    [error.START_ERROR,             "Error starting parsec"],
    [error.FILE_DELETE_ERROR,       "failed to delete a file"],
    [error.FOLDER_DELETE_ERROR,     "failed to delete a folder"],
    [error.MOVE_FILE_ERROR,         "failed to move a file"],
    [error.MAKE_DIR_ERROR,          "failed to make a directory"],
    [error.NICKNAME_NOT_EXISTS,     "Nickname does not exists"]]

const errorToMessage = {}
for ([key,value] of errorToMessageArr){
    errorToMessage[key] = value;
}
module.exports = {
    error,
    errorToMessage
}