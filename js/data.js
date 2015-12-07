/* Grabs OrgId from database based on username and password */
function sendScore(initials, score)
{
    if(initials == "") initials = "XXX";
    else if(initials.length < 2) initials += "XX";
    else if(initials.length < 2) initials += "X";
    var scorePackage =
    {
        initials: initials,
        score: score
    };

    $.ajax({
        type:'POST',
        url:'http://www.williamrobertfunk.com/applications/planetary-defense/actions/db.php',
        data: JSON.stringify(scorePackage),
        contentType:'application/x-www-form-urlencoded; charset=utf-8',
        dataType:'text',
        async: true,
        success:function()
        {
            console.log("Score entry created.");
        },
        error:function(error)
        {
            console.log(error);
            console.log(error.responseText);
            console.log(error.status);
            console.log(error.statusText);
        }
    });
}