from sklearn.pipeline import Pipeline

from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import SGDClassifier

class NB():
	def __init__(self):
		self.twenty_train = fetch_20newsgroups(subset='all')
		self.training()

	def training(self):
		self.text_clf = Pipeline([
			('vect', CountVectorizer(stop_words='english')),
			('tfidf', TfidfTransformer()),
			('clf', SGDClassifier(loss='hinge', penalty='l2', alpha=1e-3, random_state=42, max_iter=5, tol=None))
			# ('clf', MultinomialNB())
		])
		self.text_clf.fit(self.twenty_train.data, self.twenty_train.target)
		print("Done training")

	def predict(self, docs_new):
		# docs_new = ['God is love', 'OpenGL on the GPU is fast']
		# X_new_counts = count_vect.transform(docs_new)
		# X_new_tfidf = tfidf_transformer.transform(X_new_counts)

		# clf = MultinomialNB().fit(X_train_tfidf, twenty_train.target)



		# predicted = self.text_clf.predict(docs_new)
		predicted = self.text_clf.predict([docs_new])

		# for doc, category in zip(docs_new, predicted):
		# 	print('%r => %s' % (doc, self.twenty_train.target_names[category]))
		return (self.twenty_train.target_names[predicted[0]])

# train = Train()
# train.predict('Love is Thuy')