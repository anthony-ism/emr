/**
 * Created by anthony on 12/31/14.
 */
exports.generateSubParams = function(params)
{
    var result = "";
    var subParams = params.split(".");
    for (var i = 0; i < subParams.length; i++)
        result += "['" + subParams[i] + "']";
    return result;
}

exports.generateEval = function(params)
{
    var mongodb = require("mongodb"),
        objectid = mongodb.BSONPure.ObjectID;

    var obj = "";
    for (var i = 2; i < params.length; i++)
    {
        if (objectid.isValid(params[i]))
            obj += ".id('" + params[i] + "')";
        else
        {
            if (obj.length == 0)
                obj = params[i]
            else if (params[i].indexOf(".") == -1)
                obj += "['" + params[i] + "']";
            else
                obj += exports.generateSubParams(params[i]);
        }
    }
    return obj;
}