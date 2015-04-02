import os
import json
from jinja2 import Template
import jinja2
from PIL import Image
import datetime

PORTFOLIO_DIR = '/Users/alijohnson/dev/berlinjohnson.github.io/'


def is_img(filename):
    extensions = ('.png', '.jpg', '.jpeg', '.gif')
    if filename.lower().endswith(extensions):
        return file

# Creates obj for each image
# Returns a list of objects
def getImages(imageDirectory):
    files_in_thumbs = filter(is_img, list(os.walk(PORTFOLIO_DIR + 'images/' + imageDirectory + '/'))[0][2])

    # ----Looks through original folder and creates object with name, height and width
    thumbs = {}
    for img in files_in_thumbs:
        path = Image.open(PORTFOLIO_DIR + 'images/' + imageDirectory + '/' + img)
        width, height = path.size
        imgObj = {}
        imgObj['name'] = img
        imgObj['width'] = width
        imgObj['height'] = height
        imgObj['thumbHeight'] = int(height/float(width)*300)
        thumbs[img] = imgObj

    # ----Adds date and category
    with open(PORTFOLIO_DIR + 'json/sortingLabels.json', 'r') as f:
        labelData = json.load(f)
        for img in labelData:
            thumbs[img['fileName']]['categories']=img['categories']
            thumbs[img['fileName']]['creationDate']= datetime.datetime.strptime(img['creationDate'], "%Y-%m-%d").date()
    thumbsList = []
    for k, v in thumbs.items():
       thumbsList.append(v)

    return thumbsList

# Returns list of objects sorted by date
def sortListByDate(listOfObj):
    return sorted(listOfObj, key=lambda img: img['creationDate'], reverse=True)

#Pass List sorted by date and category
#Returns list containing only those in category
def is_category (list, category):
    def is_illustration(img):
        if category in img['categories']:
            return True
    categorySortedList = filter(is_illustration, list)
    return categorySortedList


# Sorts images into 3 columns based on thumbnail height
# Returns list of three lists
def sortColumns(sortedList):
    columns = [[], [], []]
    columnHeights = [0, 0, 0]

    for image in sortedList:
        if columnHeights[0] == columnHeights[1] and columnHeights[1] == columnHeights[2]:
            columns[0].append(image)
            columnHeights[0] += image['thumbHeight']
        elif columnHeights[0] == columnHeights[1]:
            if columnHeights[0] > columnHeights[2]:
                columns[2].append(image)
                columnHeights[2] += image['thumbHeight']
            else:
                columns[0].append(image)
                columnHeights[0] += image['thumbHeight']
        elif columnHeights[0] == columnHeights[2]:
            if columnHeights[0] > columnHeights[1]:
                columns[1].append(image)
                columnHeights[1] += image['thumbHeight']
            else:
                columns[0].append(image)
                columnHeights[0] += image['thumbHeight']
        elif columnHeights[1] == columnHeights[2]:
            if columnHeights[1] > columnHeights[0]:
                columns[0].append(image)
                columnHeights[0] += image['thumbHeight']
            else:
                columns[1].append(image)
                columnHeights[1] += image['thumbHeight']
        else:
            minHeightColumn = columnHeights.index(min(columnHeights))
            columns[minHeightColumn].append(image)
            columnHeights[minHeightColumn] += image['thumbHeight']
    return columns

def make_column(int):
    columnInt = {}
    columnInt['allImg'] = allSortedColumns[int]
    columnInt['illustrationImg'] = illustrationSortedColumns[int]
    columnInt['designImg'] = designSortedColumns[int]
    columnInt['threeDImg'] = threeDSortedColumns[int]
    columnInt['figureImg'] = figureSortedColumns[int]
    columnInt['shoesImg'] = shoesSortedColumns[int]
    return columnInt

 # ---------------------------------------------------------------


thumbsList = getImages('thumbs')

allSortedList = sortListByDate(thumbsList)

illustrationSortedList = is_category(allSortedList, 'illustration')
designSortedList = is_category(allSortedList, 'design')
threeDSortedList = is_category(allSortedList, '3d')
figureSortedList = is_category(allSortedList, 'figure')
shoesSortedList = is_category(allSortedList, 'shoes')

allSortedColumns = sortColumns(allSortedList)
illustrationSortedColumns = sortColumns(illustrationSortedList)
designSortedColumns = sortColumns(designSortedList)
threeDSortedColumns = sortColumns(threeDSortedList)
figureSortedColumns = sortColumns(figureSortedList)
shoesSortedColumns = sortColumns(shoesSortedList)


columnFirst = make_column(0)
columnFirst['columnID'] = 'columnFirst'

columnMiddle = make_column(1)
columnMiddle['columnID'] = 'columnMiddle'

columnLast = make_column(2)
columnLast['columnID'] = 'columnLast'

columns = [columnFirst, columnMiddle, columnLast]
data = {'columns': columns}


templateLoader = jinja2.FileSystemLoader( searchpath="/" )
templateEnv = jinja2.Environment( loader=templateLoader )

TEMPLATE_FILE = PORTFOLIO_DIR + 'templates/indexTemplate.jinja'
template = templateEnv.get_template( TEMPLATE_FILE )


outputText = template.render(data)

with open(PORTFOLIO_DIR + 'index.html', 'w') as f:
    f.write(outputText)
