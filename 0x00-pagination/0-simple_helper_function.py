#!/usr/bin/env python3

"""
Module that takes two integer arguments page and page_size
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Gets the index range from a given page and page size
    """

    return ((page - 1) * page_size, ((page - 1) * page_size) + page_size)
