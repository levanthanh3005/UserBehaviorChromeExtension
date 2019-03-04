#!/usr/bin/env python
from flask import Flask, Response, request, render_template
from time import sleep
import csv
import time

import rake

import urllib2
# import html2text
import sys
import re
import bs4 as bs
from train import NB

nb = NB()

reload(sys)
sys.setdefaultencoding('utf8')

app = Flask(__name__)

lsData = []

current_milli_time = lambda: int(round(time.time() * 1000))

keyrake = rake.Rake("SmartStoplist.txt")


@app.route('/showdata', methods=['GET', 'POST'])
def showData():
	global lsData
	return render_template('shows.html', items=lsData)

@app.route('/postjson', methods = ['POST'])
def postJsonHandler():
	global lsData
	# print (request.is_json)
	content = request.get_json()
	print (request.get_json())

	if (len(content['title']) > 30):
		content['title'] = content['title'][0:30]+".."
	if (len(content['url']) > 30):
		content['shortUrl'] = content['url'][0:30]+".."
	else :
		content['shortUrl'] = content['url']

	crdata = crawlKeywords(content['url'])

	content['keywords'] = crdata['keyword']
	content['category'] = crdata['category']
	
	content['behavior'] = 'view'
	if ('isMouseMove' in content):
		# if content['isMouseMove'] or content['isMouseClick'] :
		# 	content['behavior'] = 'view'
		if content['isMouseWheel'] :
			content['behavior'] = 'read'
		if content['isKeyPress'] :
			content['behavior'] = 'write'

	lsData.append(content)
	return 'done'

def crawlKeywords(url):
	# url = "http://stackoverflow.com"
	# f = urllib.urlopen(url)
	# htmlraw =  f.read()
	# text = html2text.html2text(htmlraw)
	# text = text.replace('\n','.')
	# text = re.sub(r"[^a-zA-Z0-9]+", ' ', text)
	# keywords = keyrake.run(text)
	global lsData
	for content in lsData :
		# print(content)
		if (url == content['url']) :
			# print("skip")
			return {
				'keyword': content['keywords'],
				'category' : content['category']
			}

	hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

	req = urllib2.Request(url, headers=hdr)

	page = urllib2.urlopen(req)

	soup = bs.BeautifulSoup(page, 'lxml')
	souptitle = soup.find('title')
	# print(soupbody)

	# for atag in soup.find_all('a', {'href':True}):
	#     if not atag['href'].startswith('http'):
	#         atag.extract()
	# for atag in soup.find_all('script'):
	# 	atag.extract()

	# print(soupbody)
	# print(keywords)
	# for hit in soup.findAll(attrs={'class' : 'MYCLASS'}):
 #  		hit = hit.text.strip()
 #  		print hit
 	# text = soup.text.strip().replace('\n','.').replace(' ','.')
 	# text = re.sub(r"[^a-zA-Z.]+", ' ', text)
 	# print(text)
 	# keywords = keyrake.run(text)
 	# print(keywords[0:3])
	# for script in souppick(["script", "style"]): # remove all javascript and stylesheet code
	# 	script.extract()
	# get text
	textTitle = souptitle.get_text().lower()

	textTitle = re.sub(r"[^a-zA-Z.,]+", ' ', textTitle)

	# print(text)

	keywords = rake.optimize_rake(textTitle)
	if (len(keywords) == 0) :
		keywords[0] = ""
	######

	soupbody = soup.find('body')
	[s.extract() for s in soupbody('script')]
	
	textBody = soupbody.text.strip()
	textBody = re.sub(r"[^a-zA-Z.]+", ' ', textBody)

	# break into lines and remove leading and trailing space on each
	lines = (line.strip() for line in textBody.splitlines())
	# break multi-headlines into a line each
	chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
	# drop blank lines
	textBody = '\n'.join(chunk for chunk in chunks if chunk)
	textBody = textBody.replace('\n', '.').replace('.',' ').lower()

	# print(keywords)
	# print(textBody)
	# print(nb.predict(textBody))
	return {
		'keyword': keywords[0],
		'category' : nb.predict(textBody)
	}

if __name__ == '__main__':

	# print(crawlKeywords("https://waitbutwhy.com/2018/04/picking-career.html"))
    app.run(host='0.0.0.0', debug=True)

