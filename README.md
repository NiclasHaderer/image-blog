## Writing Blog-Posts

Blog posts have to be placed in a single root folder that contains all the blog posts.
Every folder (that is not an `_image` folder) is considered a blog post and therefore has to contain a *post.mdx* file.

The structore is therefore the following:

```
.
└── root-folder/
    ├── _images
    ├── post.mdx
    ├── blog-post-1/
    │   ├── post.mdx
    │   └── _images/
    │       ├── image-1.jpg
    │       └── image-2.jpg
    └── blog-post-2/
        ├── post.mdx
        └── _images/
            ├── image-1.jpg
            └── image-2.jpg
```

+ The `_images` folder contains images for the blog post. The names of the images files are the ones you can reference in
the image or gallery component (see below).

+ The `post.mdx` file has to follow a specific structure:

  1. A section with metadata about this post. This metadata has to be placed at the beginning of the file and be
     surrounded by two `---` lines. The metadata is written in YAML format.
     ```mdx
     ---
     title: "My first blog post"
     date: "2021-01-01"
     tags: ["first", "blog", "post"]
     ---
     ```
     The following metadata fields are available:
     ```typescript
     // The title of the post -> will be used as the slug
     title: string
     // The date of the post
     date: string
     // The description of the post
     description: string
     // The header image of the post 
     headerImage: string
     // The color of the header image (will replace the header image if set)
     headerColor: "a hex color" | undefined = undefined
     // Should the title of the post be capitalized in the post-preview list?
     capitalizeTitle: boolean = true
     // The layout of the post
     postLayout: "post" = "post"
     // The layout that the children of this post should have
     childPostLayout: "post" = "post"
     // Where should the children be placed in the parent post
     childPostPosition: 'top' | 'bottom' = 'bottom'
     // Whether the post should be featured in the parent collection
     featureInParentCollection: boolean = true
     // The size of the header (image)
     headerSize: "small" | "medium" | "large" = "medium"
     // A sub-heading for the post
     subheader: string | undefined = undefined
     // Keywords for the post (will be added at the top of the post)
     topKeywords: string[] = []
     ```
  2. The content of the blog post. This content can be written in markdown format.
     ```mdx
     # My first blog post

     This is the content of my first blog post.
     ```
     You have access to two components that can be used in your blog posts:
      1. The gallery component
         ```mdx
         <Gallery images={
           getImage([
               "IMG_5857",
               "IMG_5885",
               "IMG_5896",
               "IMG_5914",
               "IMG_5918",
               "IMG_5925",
               "IMG_5928",
               "IMG_5934",
               "IMG_5985",
             ]
           )
         } mode='square' /> // If not specified the mode is to leave the images as they are
         ```
      2. The image component (for a single image)
         ```mdx
         <Image image={getImage("forest")} />
         ```
      3. The image lightbox component (for single images that can be opened in a lightbox)
         ```mdx
         <LightboxImage image={getImage("forest")} />
         ```

    The following is an example of a valid `post.mdx` file:
    ```mdx
    ---
    title: Portfolio
    date: 2019-01-01
    description: The portfolio page of the website.
    headerImage: IMG_6025
    headerColor: "#012D25"
    headerSize: medium
    capitalizeTitle: false
    ---
    
    # Some of my work
    
    1. lorem ipsum
    2. dolor sit amet
    3. consectetur adipiscing elit
    
    ...
    ```