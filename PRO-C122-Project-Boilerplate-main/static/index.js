$(document).ready(function(){

    console.log('Document is Ready')

    // Getting the date using Date() object and converting it to a string
    let date = new Date()
    let current_date = date.toDateString()

    // Display the date on the HTML page using jQuery and JS
    $('#date').text('Date : ' + current_date)

    
    let review = ""
    let input_data = ""
    let product = ""
    let emotion = ""
    let emoji_url = ""

    // Making a function for AJAX request
    function ajax_request(api_url, input_data){

        $.ajax({

            // Type of request
            type: 'POST',

            // URL
            url: api_url,

            // JSON data
            data: JSON.stringify(input_data),

            // Datatype of expected response
            dataType: 'json',

            // Content type
            contentType: 'application/json',

            // Success method
            success: function(result)
            {
                // Extract the sentiment and emoji path
                emotion = result.sentiment
                emoji_url = result.path

                // Update the emoticon and sentiment accordingly
                if (product == 'Smartphone'){
                    $('#m_emoji').attr('src', emoji_url)
                    $('#m_emotion').text(emotion)
                    $('#m_emoji').show()
                    $('#m_emotion').show()
                }

                else if (product == 'Digital Camera'){
                    $('#c_emoji').attr('src', emoji_url)
                    $('#c_emotion').text(emotion)
                    $('#c_emoji').show()
                    $('#c_emotion').show()
                }

                else if (product == 'Headphones'){
                    $('#h_emoji').attr('src', emoji_url)
                    $('#h_emotion').text(emotion)
                    $('#h_emoji').show()
                    $('#h_emotion').show()
                }

                else if (product == 'Video Games'){
                    $('#v_emoji').attr('src', emoji_url)
                    $('#v_emotion').text(emotion)
                    $('#v_emoji').show()
                    $('#v_emotion').show()
                }
            },

            // Error method
            error: function(result)
            {
                console.log(result)
            }

        })

        console.log('AJAX request sent')
        
    }


    // Check if Submit button under 'smartphone' is clicked and get the review accordingly
    $('#m_button').click(function(){

        review = $('#m_textbox').val()
        input_data = {'customer_review': review}
        ajax_request('/predict', input_data)

        product = 'Smartphone'
    })

    // Check if Submit button under 'camera' is clicked and get the review accordingly
    $('#c_button').click(function(){

        review = $('#c_textbox').val()
        input_data = {'customer_review': review}
        ajax_request('/predict', input_data)

        product = 'Digital Camera'
    })

    // Check if Submit button under 'headphones' is clicked and get the review accordingly
    $('#h_button').click(function(){

        review = $('#h_textbox').val()
        input_data = {'customer_review': review}
        ajax_request('/predict', input_data)

        product = 'Headphones'
    })

    // Check if Submit button under 'videogame' is clicked and get the review accordingly
    $('#v_button').click(function(){

        review = $('#v_textbox').val()
        input_data = {'customer_review': review}
        ajax_request('/predict', input_data)

        product = 'Video Games'
    })


    // If SAVE button is clicked, hit a POST request on the API
    $('#save_button').click(function(){

        console.log('Save button is clicked')

        // Input data 
        input_data = {'date': date, 'product': product, 'review': review, 'sentiment': emotion}

        // AJAX call
        $.ajax({
            type: 'POST',
            url: '/save',
            data: JSON.stringify(input_data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(result){
                console.log(result)
            },
            error: function(result){
                console.log(result)
            }
        })

        // Clearing textboxes
        $('#m_textbox').val('')
        $('#c_textbox').val('')
        $('#h_textbox').val('')
        $('#v_textbox').val('')
    })

    // Calling the displayBot function when the DOM is ready
    displayBot()

})


function displayBot() {

    // When chatbot button is clicked
    $('.chatbot-button').click(function () {

        // Toggle the chatbot chat window
        $('.chatbox__messages__cotainer').toggle()
    });

    // Start Conversation with Bot
    askBot()
}

function askBot() {

    // When send button is clicked
    $(".send-button").click(function () {

        // Get text from textbox in chatbot
        var user_bot_input_text = $(".chat-input-text").val()

        if (user_bot_input_text != "") {
           
            // Add a new div element in the chat window
            $(".chatbox__messages__cotainer").append('<div class="user__messages">' + user_bot_input_text + ' </div>')
            
            // Clear the text input box after sending the message
            $(".chat-input-text").val('');

            let chat_input_data = {
                "user_bot_input_text": user_bot_input_text
            }

            $.ajax({
                type: 'POST',

                // Write the same URL as written in app.py file
                url: '/chatbot',

                data: JSON.stringify(chat_input_data),
                dataType: "json",
                contentType: 'application/json',
                success: function (result) {
                    
                    $(".chatbox__messages__cotainer").append('<div class="bot__messages">' + result.bot_response + ' </div>')                        
                    $('.chatbox__messages__cotainer').animate({
                        scrollTop: $('.chatbox__messages__cotainer')[0].scrollHeight}, 1000);
                },
                error: function (result) {
                    alert(result.responseJSON.message)
                }
            });

        }

    })

    $('.chat-input-text').keypress(function(e){
        // If Enter key (key code is 13) is pressed
        if(e.which == 13){         
            $('.send-button').click(); // Trigger Send Button Click Event
        }
    });
}
