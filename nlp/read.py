import pickle
from pathlib import Path


def main():
    """Read and output current contents of pickle."""
    if (Path('nlp/tweets')).is_file():
        filename = 'nlp/tweets'
    else:
        filename = 'tweets'

    with open(filename, 'rb') as f:
        read_dict = pickle.load(f)
        for key, value in read_dict.items():
            # print(f'{key}: {value}')
            count = 0
            for tweet in value:
                count = count + 1
            print(f'{key}: {count}')

    f.close()


# Execute main method upon running script
if __name__ == '__main__':
    main()
