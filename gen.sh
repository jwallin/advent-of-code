mkdir -p $1
cp _template/* $1
mv $1/index.ts_ $1/index.ts
cd $1