import pickle

infile = open('tweets', 'rb')
read_dict = pickle.load(infile)
print(read_dict)
infile.close()
