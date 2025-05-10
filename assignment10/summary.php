<?php

    // extract the message that we will be sending to Google Gemini
    $message = $_POST['message'];

    // Paste your Google Gemini API key here
    // You can obtain this key by doing the following:
    // 1. Visit https://aistudio.google.com/app/apikey
    // 2. Consent to the Google API Terms of Service and click "I accept"
    // 3. Click the "Create API key" button
    // 4. Copy the API key that appears and pasted it as the value for the '$google_gemini_api_key' variable
    $google_gemini_api_key = 'AIzaSyAseOQMNZOoTVU-2z_b4gbVC2BYMf2EI_I';

    // This is the model you plan on using - you can see the valid list of models,
    // along with their usage limits, by visiting the Google AI Studio prompt builder page:
    // https://aistudio.google.com/prompts/new_chat
    // The model listing is displayed in the drop down menu on the right side of the page
    $model = 'gemini-2.0-flash';

    // This is the API endpoint that we will use to communicate with Google Gemini
    $url = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . $google_gemini_api_key;

    // Next, we have to construct a "CURL" request
    // CURL stands for "Client URL" and is used to make network calls to resources on other servers.
    // You can think of this like PHP's way of making a fetch request

    // This is the POST data that we plan on sending to the server
    $post_data = [
        "contents" => [
            [
                "parts" => [
                    [
                        "text" => $message                      
                    ]
                ]
            ]
        ]
    ];

    // Next, define the headers for our request to tell Google Gemini that we plan on sending JSON data
    $headers = [
        'Content-Type: application/json'
    ];

    // Finally, make the request to the API and wait for a response
    // Note that this is a synchronously operation, and PHP will "block" while a CURL request
    // The program will pause to wait for a response from Google Gemini before continuing, unlike JavaScript which handles these
    // kinds of requests asynchronously
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    // Execute cURL request
    $response = curl_exec($ch);
    
    // Close the cURL handle
    curl_close($ch);
    
    // Decode results into JSON - this will allow us to work with the result as though it was an array
    $results = json_decode($response, true);

    // Finally, extract the model's response from the $results array
    // This array has lots of data in it, and most of it isn't really necessary for our purposes
    // If you print out the full response you would see something like the following - note that this response
    // came back from the model based on the prompt "Please tell me a knock knock joke"

    // print_r($results);
    /*
        Array
        (
            [candidates] => Array
                (
                    [0] => Array
                        (
                            [content] => Array
                                (
                                    [parts] => Array
                                        (
                                            [0] => Array
                                                (
                                                    [text] => Okay, here's one:

        Knock knock.

        Who's there?

        Lettuce.

        Lettuce who?

        Lettuce in, it's cold out here!

                                                )

                                        )

                                    [role] => model
                                )

                            [finishReason] => STOP
                            [avgLogprobs] => -0.033758401870728
                        )

                )

            [usageMetadata] => Array
                (
                    [promptTokenCount] => 7
                    [candidatesTokenCount] => 36
                    [totalTokenCount] => 43
                    [promptTokensDetails] => Array
                        (
                            [0] => Array
                                (
                                    [modality] => TEXT
                                    [tokenCount] => 7
                                )

                        )

                    [candidatesTokensDetails] => Array
                        (
                            [0] => Array
                                (
                                    [modality] => TEXT
                                    [tokenCount] => 36
                                )

                        )

                )

            [modelVersion] => gemini-2.0-flash
        )
    */

    // We only really need the model's text response, so we can extract that into a new variable
    $response_text = $results['candidates'][0]['content']['parts'][0]['text'];

    // Send the response text to the client and end the program
    print $response_text;

?>