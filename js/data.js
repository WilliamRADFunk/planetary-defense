/* Grabs OrgId from database based on username and password */
function sendScore(initials, score)
{
    if(initials == "") initials = "XXX";
    var scorePackage =
    {
        initials: initials,
        score: score
    };

    $.ajax({
        type:'POST',
        url:'http://www.williamrobertfunk.com/applications/planetary-defense/actions/db.php',
        data: JSON.stringify(scorePackage),
        contentType:'application/json; charset=utf-8',
        dataType:'json',
        async: true,
        success:function()
        {
            console.log("Score entry created.");
        },
        error:function(error)
        {
            console.log(error.responseText);
            console.log(error.status);
            console.log(error.statusText);
        }
    });
}