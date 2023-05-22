# MINI3

MINI3 is an extremely simple and easy to understand skeleton PHP application, reduced to the max.
MINI3 is NOT a professional framework and does not come with all the stuff real frameworks have.
If you just want to show some pages, do a few database calls and a little-bit of AJAX here and there, without
reading in massive documentations of highly complex professional frameworks, then MINI3 might be very useful for you.
MINI3 is easy to install, runs nearly everywhere and doesn't make things more complicated than necessary.

## Features

- extremely simple, easy to understand
- simple but clean structure
- makes "beautiful" clean URLs
- demo CRUD actions: Create, Read, Update and Delete database entries easily
- demo AJAX call
- tries to follow PSR coding guidelines
- uses PDO for any database requests, comes with an additional PDO debug tool to emulate your SQL statements
- uses only native PHP code, so people don't have to learn a framework
- uses PSR-4 autoloader

## Requirements

- PHP 8
- MySQL
- basic knowledge of Composer 

## Manual Installation

1. Edit the database credentials in `application/config/config.php`
2. Execute the .sql statements in the `_install/`-folder (with PHPMyAdmin for example).
3. Make sure you have mod_rewrite activated on your server / in your environment.
4. Install composer and run `composer install` in the project's folder to create the PSR-4 autoloading stuff from Composer automatically. 

MINI3 runs without any further configuration. You can also put it inside a sub-folder, it will work without any
further configuration.

## Security

The script makes use of mod_rewrite and blocks all access to everything outside the /public folder.
Your .git folder/files, operating system temp files, the application-folder and everything else is not accessible
(when set up correctly). For database requests PDO is used, so no need to think about SQL injection (unless you
are using extremely outdated MySQL versions).

## How to include stuff / use PSR-4

As this project uses proper PSR-4 namespaces, make sure you load/use your stuff correctly:
Instead of including classes with old-school code like `include xxx.php`, simply do something like `use Mini\Model\Song;` on top of your file (modern IDEs even do that automatically).
This would automatically include the file *Song.php* from the folder *Mini/Model* (it's case-sensitive!).
 
But wait, there's no `Mini/Model/Song.php` in the project, but a `application/Model/Song.php`, right ?
To keep things cleaner, the composer.json sets a *namespace* (see code below), which is basically a name or an alias, for a certain folder / area of your application,
in this case the folder `application` is now reachable via `Mini` when including stuff.

```
{
    "psr-4":
    {
        "Mini\\" : "application/"
    }
}
```

This might look stupid at first, but comes in handy later. To sum it up:

To load the file `application/Model/Song.php`, write a `use Mini\Model\Song;` on top of your controller file.
Have a look into the SongController to get an idea how everything works!

FYI: As decribed in the install tutorial, you'll need do perform a "composer install" when setting up your application for the first time, which will
create a set of files (= the autoloader) inside /vendor folder. This is the normal way Composer handle this stuff. If you delete your vendor folder 
the autoloading will not work anymore. If you change something in the composer.json, always make sure to run composer install/update again!

## Goodies

MINI3 comes with a little customized [PDO debugger tool](https://github.com/panique/pdo-debug) (find the code in
application/libs/helper.php), trying to emulate your PDO-SQL statements. It's extremely easy to use:

```php
$sql = "SELECT id, artist, track, link FROM song WHERE id = :song_id LIMIT 1";
$query = $this->db->prepare($sql);
$parameters = array(':song_id' => $song_id);

echo Helper::debugPDO($sql, $parameters);

$query->execute($parameters);
```

## Quick-Start

#### The structure in general

The application's URL-path translates directly to the controllers (=files) and their methods inside
application/controllers.

`example.com/home/exampleOne` will do what the *exampleOne()* method in application/Controller/HomeController.php says.

`example.com/home` will do what the *index()* method in application/Controller/HomeController.php says.

`example.com` will do what the *index()* method in application/Controller/HomeController.php says (default fallback).

`example.com/songs` will do what the *index()* method in application/Controller/SongsController.php says.

`example.com/songs/editsong/17` will do what the *editsong()* method in application/Controller/SongsController.php says and
will pass `17` as a parameter to it.

Self-explaining, right ?

#### Showing a view

Let's look at the exampleOne()-method in the home-controller (application/Controller/HomeController.php): This simply shows
the header, footer and the example_one.php page (in views/home/). By intention as simple and native as possible.

```php
public function exampleOne()
{
    // load view
    require APP . 'views/_templates/header.php';
    require APP . 'views/home/example_one.php';
    require APP . 'views/_templates/footer.php';
}
```  

#### Working with data

Let's look into the index()-method in the songs-controller (application/Controller/SongsController.php): Similar to exampleOne,
but here we also request data. Again, everything is extremely reduced and simple: $Song->getAllSongs() simply
calls the getAllSongs()-method in application/Model/Song.php (when $Song = new Song()).

```php
namespace Mini\Controller

use Mini\Model\Song;

class SongsController
{
    public function index()
    {
        // Instance new Model (Song)
        $Song = new Song();
        // getting all songs and amount of songs
        $songs = $Song->getAllSongs();
        $amount_of_songs = $Song->getAmountOfSongs();

        // load view. within the view files we can echo out $songs and $amount_of_songs easily
        require APP . 'views/_templates/header.php';
        require APP . 'views/songs/index.php';
        require APP . 'views/_templates/footer.php';
    }
}
```

For extreme simplicity, data-handling methods are in application/model/ClassName.php. Have a look how getAllSongs() in model.php looks like: Pure and
super-simple PDO.

```php
namespace Mini\Model

use Mini\Core\Model;

class Song extends Model
{
    public function getAllSongs()
    {
        $sql = "SELECT id, artist, track, link FROM song";
        $query = $this->db->prepare($sql);
        $query->execute();

        return $query->fetchAll();
    }
}
```

The result, here $songs, can then easily be used directly
inside the view files (in this case application/views/songs/index.php, in a simplified example):

```php
<tbody>
<?php foreach ($songs as $song) { ?>
    <tr>
        <td><?php if (isset($song->artist)) echo htmlspecialchars($song->artist, ENT_QUOTES, 'UTF-8'); ?></td>
        <td><?php if (isset($song->track)) echo htmlspecialchars($song->track, ENT_QUOTES, 'UTF-8'); ?></td>
    </tr>
<?php } ?>
</tbody>
```
