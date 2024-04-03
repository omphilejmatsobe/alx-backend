#!/usr/bin/python3
"""
Inherits from BaseCaching and is a caching system
"""


from threading import RLock
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """
    Inherits from BaseCaching and is a caching system
    """


    def __init__(self):
        """
        Instantiation method, sets instance attributes
        """
        super().__init__()
        self.__keys = []
        self.__rlock = RLock()

    def put(self, key, item):
        """
        assign to the dictionary the item value for the key key
        """
        if key is not None and item is not None:
            _key = self._balance(key)
            with self.__rlock:
                self.cache_data.update({key: item})
            if _key is not None:
                print('DISCARD: {}'.format(_key))

    def get(self, key):
        """
        returns the value in self.cache_data linked to key
        """
        with self.__rlock:
            value = self.cache_data.get(key, None)
            if key in self.__keys:
                self._balance(key)

        return value

    def _balance(self, keyIn):
        """
        Removes the earliest item from the cache at MAX size
        """

        keyOut = None
        with self.__rlock:
            keysLength = len(self.__keys)
            if keyIn not in self.__keys:
                if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                    keyOut = self.__keys.pop(0)
                    self.cache_data.pop(_key)
            else:
                self.__keys.remove(keyIn)
            self.__keys.insert(keysLength, keyIn)

        return _key
