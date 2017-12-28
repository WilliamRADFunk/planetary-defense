/* Inserts the new score, identified by the user's initials (arcade-style) */
function sendScore(initials, score)
{
    if(initials === "") initials = "___";
    else if(initials.length < 2) initials += "__";
    else if(initials.length < 2) initials += "_";
    var scorePackage =
    {
        initials: initials,
        score: score
    };

    $.ajax({
        type:'POST',
        url:'https://tenaciousteal.com/games/planetary-defense/actions/insert.php',
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
/* Gets top-five scores (arcade-style) */
function getScores()
{
    var scores = [];
    $.ajax({
        type:'GET',
        url:'https://tenaciousteal.com/games/planetary-defense/actions/getScores.php',
        dataType:'json',
        async: true,
        success:function(responseData) {
            console.log("Success");
            console.log(responseData);
            GAME.populateTopTen(responseData);
        },
        error:function(error)
        {
            console.log("Failed");
            console.log(error);
            console.log(error.responseText);
            console.log(error.status);
            console.log(error.statusText);
        }
    });
}