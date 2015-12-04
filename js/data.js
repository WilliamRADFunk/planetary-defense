/* Grabs OrgId from database based on username and password */
function sendScore(initials, score)
{
    $.ajax({
        type:'POST',
        url:'http://www.williamrobertfunk.com/applications/planetary-defense/actions/db.php',
        data: JSON.stringify({ initials: initials, score: score }),
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