import os

filenames = []

# Parcourt le répertoire
for filename in os.listdir("./public"):
    # Vérifie si le fichier est un .glb et n'est pas "model.glb"
    if ".glb" in filename and filename != "model.glb":
        full_path = os.path.join("./public", filename)
        # Ajoute le fichier avec son horodatage
        filenames.append((filename, os.path.getctime(full_path)))

# Trie les fichiers par horodatage croissant
filenames.sort(key=lambda x: x[1])

# Garde uniquement les noms de fichier
ordered_filenames = [filename for filename, _ in filenames]

print(ordered_filenames)