import Image
import os

PORTFOLIO_DIR = '/Users/alijohnson/dev/berlinjohnson.github.io/'

def is_img(filename):
    extensions = ('.png', '.jpg', '.jpeg')
    return filename.lower().endswith(extensions)


def resizeOriginals():
    files_in_originals = filter(is_img, list(os.walk(PORTFOLIO_DIR + 'images/originals/'))[0][2])

    for img in files_in_originals:
        imageFile = Image.open(PORTFOLIO_DIR + 'images/originals/' + img)
        width, height = imageFile.size
        ratio = (300.0/width)
        resized = imageFile.resize((300, int(ratio*height)), Image.ANTIALIAS)
        resized.save(PORTFOLIO_DIR + 'images/thumbs/300' + img, quality=300)

resizeOriginals()
print "------Remember to make gif thumbs manually!------"
