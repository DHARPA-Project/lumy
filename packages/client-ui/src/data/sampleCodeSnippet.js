export const samplePythonCodeSnippet = `import pandas as pd

# Create a dataframe to use
df = pd.DataFrame({'col_A': ['kiwi', 'banana', 'apple'],
	           'col_B': ['pineapple', 'grapes', 'grapefruit'],
		   'col_C': ['blueberry', 'grapefruit', 'orange']})

# Compress and save dataframe to file
df.to_csv('sample_dataframe.csv.zip', index=False, compression='zip')
print('Dataframe compressed and saved to file')

# Read compressed zip file into dataframe
df = pd.read_csv('sample_dataframe.csv.zip',)
print(df)`
