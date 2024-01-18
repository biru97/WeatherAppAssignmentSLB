class Book():
    def __init__(self, name: str, author: str, genre: str, publisher: str):
        self.name = name
        self.author = author
        self.genre = genre
        self.publisher = publisher
        self.checked_status = False
        self.checked_by = {}

    def set_checked(self, user_details: dict):
        if not self.checked_status:
            self.checked_by["name"] = user_details["name"]
            self.checked_by["id"] = user_details["id"]
            self.checked_status = True
        elif self.checked_by["name"] == user_details["name"] and self.checked_by["id"] == user_details["id"]:
            self.checked_by = {}
            self.checked_status = False
        else:
            raise RuntimeError("This user do not have the book checked out or the book is already checked out")

    def get_checked(self):
        return self.checked_status, self.checked_by
    
class User():
    def __init__(self, name: str, user_id: int):
        self.name = name
        self.id = user_id
        self.checked_books = []

    def set_checked_books(self, book_object):
        if len(self.checked_books) <= 3:
            self.checked_books.append(book_object)
        else:
            raise RuntimeError("User already has max no. of allowed books !!")
    
    def check_in_books(self, book_object: Book):
        book_object.set_checked({"name": self.name, "id": self.id})
        self.checked_books.remove(book_object)
    
    def get_checked_books(self):
        return self.checked_books
    
if __name__ == "__main__":
    unique_book_list = [{
    "name": "a",
    "author": "b",
    "genre": "c",
    "publisher": "d"
    }, {
        "name": "e",
        "author": "f",
        "genre": "g",
        "publisher": "h"
    }]

    book_library = []

    for item in unique_book_list:
        book_library.append(Book(item["name"], item["author"], item["genre"], item["publisher"]))
    
    user1 = User("Bireswar", 2)
    user2 = User("joe", 3)

    #user 1 checks all the books out
    for book in book_library:
        book.set_checked({"name": user1.name, "id": user1.id})
        user1.set_checked_books(book) #can be named meaning fully as check_out books
    
    #user 2 tries to check out 1 of the books
    try:
        book_library[1].set_checked({"name": user2.name, "id": user2.id})
    except:
        print(book_library[1].get_checked())    

    #let the user check in the book
    user1.check_in_books(book_library[1])

    #check the status of get_checked()
    print(book_library[1].get_checked())

    #the user2 can now easily check out the book
    book_library[1].set_checked({"name": user2.name, "id": user2.id})
    print(book_library[1].get_checked())

    # Basic strcture of the two classes is done many added functionalities are reamaining implementation