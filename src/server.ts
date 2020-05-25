import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateImageURL} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // GET /filteredimage?image_url={{URL}}
  // Endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file

  //! END @TODO1
  app.get( "/filteredimage/",  async( req, res ) => {
    let image_url: string = req.query.image_url;

    // validate query string param
    if ( !image_url ||  !validateImageURL(image_url))
    {
    return res.status(400)
                .send(`Url does not point to a picture or is invalid`);
    }

    try
    {
      let filteredImage =  await filterImageFromURL(image_url);
      return res.status(200)
                .sendFile(filteredImage);
    }
    catch(e)
    {
      return res.status(500)
                .send(`An error occurred processing the request`);
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();